
function Alert({ alert }: { alert: { state: boolean; text: string } }) {
  return (
    <div
      className={`absolute bottom-4 z-30 ${
        alert.state ? "left-4" : "left-[-100%]"
      } bg-[#fff] text-black rounded-md px-4 py-2 transition-all duration-300`}
    >
      <p>{alert.text}</p>
    </div>
  );
}

export default Alert;
