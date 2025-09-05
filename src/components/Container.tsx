export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="mx-auto w-full max-w-[1200px] overflow-auto p-4">
      <div className={className}>{children}</div>
    </div>
  );
};
