import type { GigPreviewView } from "@/modules/gigs/application/dto/gig-preview.view";

/** The band's stage performance now and one expected season per circuit (ADR-0022). */
export class GigPreviewsView {
  /** Expected stage performance, `0..1` (variance neutral). */
  performance: number;
  /** One preview per circuit, in catalog order. */
  previews: GigPreviewView[];
}
