const Title = ({text,id}) => {
  return (
    <div id={id} className="border-y border-neutral-100 w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 px-4">
        <h1 className="text-xs font-mono uppercase py-2 text-neutral-400">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default Title;
