import React from 'react';

// Define the type for the `title` prop as `string`
interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <h1 className="text-3xl font-bold mb-4">{title}</h1>
);

export default SectionHeader;
