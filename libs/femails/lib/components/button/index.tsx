interface ButtonProps {
  title: string;
}

const button = ({ title }: ButtonProps) => {
  return (
    <div>
      <button>{title}</button>
    </div>
  );
};

export default button;
