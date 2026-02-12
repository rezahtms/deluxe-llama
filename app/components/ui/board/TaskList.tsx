export default function TaskList({
  children,
  listRef,
  isDropTarget = false,
}: {
  children: React.ReactNode;
  listRef?: (node: HTMLUListElement | null) => void;
  isDropTarget?: boolean;
}) {
  return (
    <ul
      ref={listRef}
      role="list"
      className={`task-list ${isDropTarget ? "task-list--drop-target" : ""}`}
    >
      {children}
    </ul>
  );
}
