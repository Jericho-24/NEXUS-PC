import { AlertTriangle, LoaderCircle, PackageSearch } from "lucide-react";

export function LoadingState({ label = "Loading your store..." }) {
  return (
    <div className="state-box" role="status">
      <LoaderCircle className="animate-spin text-cyan" size={28} />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box state-error" role="alert">
      <AlertTriangle size={25} />
      <strong>We hit a snag</strong>
      <span>{message}</span>
      {onRetry && <button className="button button-outline mt-3" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message = "Check back soon for something new." }) {
  return (
    <div className="state-box">
      <PackageSearch className="text-cyan" size={30} />
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
