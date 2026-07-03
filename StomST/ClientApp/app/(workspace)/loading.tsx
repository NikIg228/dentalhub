import { SkeletonList } from "@/components/FeedbackState";

export default function WorkspaceLoading() {
  return (
    <div className="workspace-route-loading" aria-label="Загрузка раздела">
      <section className="route-loading-head">
        <span />
        <strong />
      </section>
      <section className="route-loading-grid">
        <SkeletonList rows={5} />
        <SkeletonList rows={5} />
      </section>
    </div>
  );
}
