import React, { useState } from 'react';
import { Bold, Heading2, Italic, Link2, List, Quote, Eye, Pencil, ImagePlus, ShoppingCart, ImageUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ImageUploadButton from './ImageUploadButton';
import MarkdownContent from '@/components/content/MarkdownContent';

const tools = [
  { icon: Heading2, label: 'Tiêu đề', before: '## ', after: '' },
  { icon: Bold, label: 'Đậm', before: '**', after: '**' },
  { icon: Italic, label: 'Nghiêng', before: '*', after: '*' },
  { icon: List, label: 'Danh sách', before: '- ', after: '' },
  { icon: Quote, label: 'Trích dẫn', before: '> ', after: '' },
  { icon: Link2, label: 'Link', before: '[', after: '](https://)' },
];

function renderImageMarkdown(url, fileName) {
  const alt = (fileName || 'Hinh-anh')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  return `![${alt}](${url})`;
}

export default function MarkdownEditor({ value = '', onChange, rows = 10 }) {
  const [preview, setPreview] = useState(false);

  const insert = (tool) => {
    const next = `${value || ''}${value ? '\n' : ''}${tool.before}${tool.label}${tool.after}`;
    onChange(next);
  };

  const handleImageUploaded = (url, file) => {
    const snippet = renderImageMarkdown(url, file?.name);
    const next = `${value || ''}${value ? '\n\n' : ''}${snippet}\n`;
    onChange(next);
  };

  const insertBuyNowCta = () => {
    const snippet = '[MUA NGAY](https://)';
    const next = `${value || ''}${value ? '\n\n' : ''}${snippet}`;
    onChange(next);
  };

  const insertLinkedImage = () => {
    const snippet = '[![mo-ta-anh](https://url-anh.com)](https://link-affiliate-cua-anh.com)';
    const next = `${value || ''}${value ? '\n\n' : ''}${snippet}`;
    onChange(next);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/60 px-2 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {tools.map((tool) => (
            <Button key={tool.label} type="button" variant="ghost" size="sm" className="h-8 gap-1 px-2" onClick={() => insert(tool)}>
              <tool.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          ))}

          <ImageUploadButton
            onUploaded={handleImageUploaded}
            size="sm"
            variant="ghost"
            className="h-8 gap-1 px-2"
            label="Ảnh"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={() => insert({ icon: ImagePlus, label: 'Ảnh', before: '![mo-ta-anh](', after: ')' })}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">URL ảnh</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={insertLinkedImage}
          >
            <ImageUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ảnh + link</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2"
            onClick={insertBuyNowCta}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">MUA NGAY</span>
          </Button>
        </div>

        <Button type="button" variant="outline" size="sm" className="h-8 gap-1" onClick={() => setPreview(!preview)}>
          {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {preview ? 'Viết' : 'Xem trước'}
        </Button>
      </div>

      {preview ? (
        <div className={cn('min-h-[220px] bg-background p-4', rows > 8 && 'min-h-[320px]')}>
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nội dung xem trước sẽ hiển thị ở đây.</p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          className="resize-y rounded-none border-0 focus-visible:ring-0"
        />
      )}
    </div>
  );
}
