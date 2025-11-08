import Button from "./Button";

const Navbar = () => {
  return (
    <nav id="navbar" className="border-b border-neutral-100 w-full">
      <div className="flex justify-between items-center max-w-6xl mx-auto border-x border-neutral-100 p-4">
        <h1 className="bric text-4xl uppercase">WCUT</h1>
        <Button >
          <a href="#contact">Contact</a>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
