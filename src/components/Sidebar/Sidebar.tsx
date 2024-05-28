import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import allClapSounds from "../../helpers/importClap";

function DraggableListItem({ name, url }: { name: string; url: string }) {
  const listItemRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false); // NEW

  useEffect(() => {
    const el = listItemRef.current;

    if (!el) return undefined;

    return draggable({
      element: el,
      getInitialData: () => ({ name, url }),
      onDragStart: () => setDragging(true), // NEW
      onDrop: () => setDragging(false), // NEW
    });
  }, [name, url]);

  return (
    <li ref={listItemRef} className={dragging ? "opacity-20" : ""}>
      {name}
    </li>
  );
}

function Sidebar() {
  return (
    <div className="bg-userSidebarBg flex flex-col p-4">
      <ul>
        <li>Claps</li>
        <ul className="ml-4">
          {allClapSounds.map(({ name, url }) => (
            <DraggableListItem key={name} name={name} url={url} />
          ))}
        </ul>
      </ul>
    </div>
  );
}

export default Sidebar;
