export default function Board({ children }: { children: React.ReactNode }) {
  return (
    <div id="board" className="board">
      {children}
    </div>
  );
}
