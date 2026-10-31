import { getPromoPopupSettings } from "@/lib/cms/data";
import { PromoPopupDialog } from "./PromoPopupDialog";

/**
 * Server-side loader for the Cpanel-managed entrance popup. Reading the
 * setting here keeps the client bundle free of DB code and lets the cached
 * `cms` tag refresh the banner immediately after a settings save.
 */
export async function PromoPopup() {
  const settings = await getPromoPopupSettings();
  if (!settings.enabled) return null;
  return <PromoPopupDialog settings={settings} />;
}
