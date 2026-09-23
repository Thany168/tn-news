export type AdPosition = "header" | "sidebar_top" | "sidebar_bottom" | "footer";

export interface Ad {
  id: number;
  title: string;
  image: string;
  target_url: string;
  position: AdPosition;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
