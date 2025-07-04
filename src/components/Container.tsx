export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="max-w-[1200px] mx-auto w-[1200px] overflow-auto">
      <div className={className}>{children}</div>
    </div>
  );
};
