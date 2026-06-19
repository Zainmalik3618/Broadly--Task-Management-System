export const Spinner = ({ fullPage = false }) => (
  <div className={fullPage ? "grid min-h-screen place-items-center" : "grid min-h-48 place-items-center"}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
  </div>
);
