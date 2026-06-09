# Hướng Dẫn Tăng Cường Bảo Mật & Chống DDoS

Tài liệu này dùng cho dự án `Mã Giảm Giá Pro` tại `D:\Shopee`.

Mục tiêu:

- giảm nguy cơ bị DDoS/DoS ở tầng mạng và tầng ứng dụng
- hạn chế brute-force, spam API, giữ kết nối treo
- giảm khả năng bị giả mạo request analytics hoặc làm bẩn thống kê
- khóa chặt cấu hình production để không chạy với secret mặc định
- giúp theo dõi sớm khi có dấu hiệu bị tấn công

## 1. Những gì đã được bật ngay trong code

Các lớp bảo vệ đã có sẵn trong codebase:

- `server/index.js`
  - rate limit cho đăng nhập admin
  - rate limit cho analytics click/copy
  - rate limit cho đọc API công khai
  - rate limit cho upload và mutation admin
  - timeout cho HTTP server chống giữ kết nối quá lâu
  - `Cache-Control: no-store` cho API auth
  - security event logger cho request chậm, 429, 401/403/5xx
- `server/services/security-service.js`
  - CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`
  - kiểm tra same-origin cho request thay đổi dữ liệu
  - token HMAC ngắn hạn cho analytics để chống giả mạo/replay
  - chặn production nếu `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` yếu
- `server/services/auth-service.js`
  - không cho production dùng secret mặc định
- `server/services/entity-service.js`
  - không tin `brand_name`, `brand_id`, `voucher_title` từ client khi ghi analytics

## 2. Biến môi trường cần có trên production

Tối thiểu phải cấu hình:

```env
NODE_ENV=production
AUTH_SECRET=doi-thanh-secret-ngau-nhien-it-nhat-32-ky-tu
ANALYTICS_TOKEN_SECRET=doi-thanh-secret-rieng-cho-analytics
ADMIN_EMAIL=admin@tenmiencuaban.com
ADMIN_PASSWORD=mat-khau-rat-manh-it-nhat-12-ky-tu
CRON_SECRET=mot-secret-rieng-cho-cron
TRUST_PROXY=1
HTTP_REQUEST_TIMEOUT_MS=15000
HTTP_HEADERS_TIMEOUT_MS=10000
HTTP_KEEPALIVE_TIMEOUT_MS=5000
HTTP_MAX_REQUESTS_PER_SOCKET=100
ANALYTICS_TOKEN_TTL_MS=600000
ANALYTICS_RATE_LIMIT_MAX=15
ANALYTICS_RATE_LIMIT_WINDOW_MS=600000
PUBLIC_READ_RATE_LIMIT_MAX=120
PUBLIC_READ_RATE_LIMIT_WINDOW_MS=60000
ADMIN_MUTATION_RATE_LIMIT_MAX=60
ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS=60000
UPLOAD_RATE_LIMIT_MAX=20
UPLOAD_RATE_LIMIT_WINDOW_MS=600000
SECURITY_SLOW_REQUEST_MS=1500
```

Khuyến nghị:

- `AUTH_SECRET` và `ANALYTICS_TOKEN_SECRET` dùng chuỗi ngẫu nhiên dài 32-64 ký tự
- không dùng lại cùng một secret cho nhiều mục đích
- không commit `.env` lên GitHub

## 3. Mẫu cấu hình Nginx chống abuse

Nếu anh đặt Nginx phía trước Node/Express, dùng mẫu sau:

```nginx
# Giới hạn request theo IP
limit_req_zone $binary_remote_addr zone=req_per_ip:10m rate=10r/s;

# Giới hạn số kết nối đồng thời theo IP
limit_conn_zone $binary_remote_addr zone=conn_per_ip:10m;

server {
    listen 80;
    server_name example.com;

    # Cắt client gửi chậm để chống Slowloris
    client_header_timeout 10s;
    client_body_timeout 10s;
    send_timeout 10s;
    keepalive_timeout 15s;

    # Chặn request body quá lớn
    client_max_body_size 4m;

    location / {
        # Cho burst ngắn rồi chặn
        limit_req zone=req_per_ip burst=20 nodelay;
        limit_conn conn_per_ip 20;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3001;
    }

    location /api/auth/login {
        limit_req zone=req_per_ip burst=5 nodelay;
        limit_conn conn_per_ip 5;
        proxy_pass http://127.0.0.1:3001;
    }

    location /api/uploads/ {
        limit_req zone=req_per_ip burst=5 nodelay;
        limit_conn conn_per_ip 5;
        proxy_pass http://127.0.0.1:3001;
    }
}
```

## 4. Mẫu cấu hình Apache chống abuse

Nếu dùng Apache, bật `mod_reqtimeout` và `mod_evasive`:

```apache
# Chống gửi header/body quá chậm
RequestReadTimeout header=10-20,MinRate=500 body=10,MinRate=500

<IfModule mod_evasive20.c>
    DOSHashTableSize 3097
    DOSPageCount 20
    DOSSiteCount 100
    DOSPageInterval 1
    DOSSiteInterval 1
    DOSBlockingPeriod 60
</IfModule>

KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5
LimitRequestBody 4194304
```

## 5. Cloudflare / CDN / WAF nên bật thế nào

Nếu anh dùng custom domain, nên để Cloudflare đứng trước Vercel hoặc máy chủ gốc.

### Thiết lập cơ bản

1. Trỏ DNS qua Cloudflare và bật biểu tượng đám mây màu cam.
2. Bật `Always Use HTTPS`.
3. Bật `Automatic HTTPS Rewrites`.
4. Bật `WAF Managed Rules`.
5. Bật `Bot Fight Mode` hoặc `Super Bot Fight Mode`.
6. Bật `Browser Integrity Check`.

### Các rate limit rule nên tạo

#### Rule 1: Login admin

- Path: `/api/auth/login`
- Nếu cùng 1 IP vượt quá `10 request / 10 phút`
- Action: `Managed Challenge` hoặc `Block`

#### Rule 2: Analytics

- Path: `/api/click-events` hoặc `/api/copy-events`
- Nếu cùng 1 IP vượt quá `30 request / 10 phút`
- Action: `Block`

#### Rule 3: Public API read

- Path bắt đầu bằng `/api/`
- Nếu cùng 1 IP vượt quá `200 request / 1 phút`
- Action: `Managed Challenge`

#### Rule 4: Upload

- Path bắt đầu bằng `/api/uploads/`
- Nếu cùng 1 IP vượt quá `20 request / 10 phút`
- Action: `Block`

### Cache rule nên bật

Cache mạnh cho asset tĩnh:

- `*.js`
- `*.css`
- `*.png`
- `*.jpg`
- `*.webp`
- `*.svg`
- `*.woff2`

Không cache:

- `/api/*`
- `/admin/*`
- `/login`

## 6. Mẫu fail2ban cho máy tự host

`fail2ban` chỉ áp dụng nếu anh có VPS/Linux riêng. Nếu chỉ dùng Vercel thì không dùng phần này.

### `jail.local`

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 6
findtime = 600
bantime = 3600

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 30
findtime = 60
bantime = 3600
```

### Filter ví dụ cho brute-force login

```ini
[Definition]
failregex = ^<HOST> - .* "(POST|GET) /api/auth/login .*" 401
ignoreregex =
```

Sau khi tạo xong:

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

## 7. Công cụ quét bảo mật nên chạy định kỳ

### OWASP ZAP

Quét XSS, header thiếu, auth flow, route public.

Ví dụ:

```bash
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://domaincuaban.com
```

### Nikto

Quét misconfiguration và file lộ:

```bash
nikto -h https://domaincuaban.com
```

### Nuclei

Quét template vulnerability:

```bash
nuclei -u https://domaincuaban.com
```

## 8. Cách đọc log khi nghi ngờ bị tấn công

Code hiện tại đã log các request đáng ngờ với prefix:

```text
[security-event]
```

Anh cần chú ý:

- nhiều `429` liên tiếp
- nhiều `401` vào `/api/auth/login`
- nhiều request rất chậm (`duration_ms` cao)
- nhiều `5xx`
- 1 IP bắn liên tục vào `/api/uploads/`, `/api/auth/`, `/api/accesstrade/`

Nếu dùng Vercel:

- xem `Functions Logs`
- lọc theo `429`, `401`, `500`
- tìm các `user_agent` lạ hoặc cùng IP lặp lại

Nếu tự host:

- theo dõi `nginx access.log`, `error.log`
- gửi log sang Grafana/Loki hoặc ELK nếu lưu lượng lớn

## 9. Quy trình deploy an toàn

Mỗi lần deploy production:

1. kiểm tra đầy đủ env
2. build local:

```powershell
npm run build
```

3. xác nhận không còn secret mặc định
4. redeploy
5. kiểm tra:
   - `/api/health`
   - đăng nhập admin
   - upload ảnh
   - click/copy voucher
   - log lỗi trên hosting

## 10. Checklist khẩn cấp khi bị tấn công

1. Bật `Under Attack Mode` trên Cloudflare.
2. Tăng độ chặt rate limit của `/api/*` và `/api/auth/login`.
3. Chặn IP hoặc ASN gây spam.
4. Tạm tắt upload nếu bị abuse.
5. Kiểm tra log `security-event`.
6. Đổi ngay `AUTH_SECRET`, `ANALYTICS_TOKEN_SECRET`, `CRON_SECRET` nếu nghi lộ.
7. Kiểm tra lại tài khoản admin và lịch sử đăng nhập.

## 11. Những việc có thể làm tiếp

Nếu muốn siết mạnh hơn nữa, có thể làm tiếp:

- thêm CAPTCHA hoặc Turnstile cho đăng nhập admin
- thêm allowlist IP cho `/admin`
- thêm Cloudflare Zero Trust để chỉ IP của anh vào được admin
- đưa log sang hệ thống giám sát tập trung
- thêm cảnh báo Telegram/Discord khi có spike `429`, `401`, `5xx`

