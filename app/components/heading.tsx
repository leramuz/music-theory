type HeadingProps = {
  title: string;
  subtitle?: string;
};

export const Heading = ({ title, subtitle }: HeadingProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
};
