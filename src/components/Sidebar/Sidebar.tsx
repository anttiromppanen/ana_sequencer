import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  FolderIcon,
  MusicalNoteIcon,
  FolderOpenIcon,
} from "@heroicons/react/16/solid";
import allClapSounds from "../../helpers/sounds/importClapSounds";

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
    <li
      ref={listItemRef}
      className={`cursor-pointer ${dragging && "opacity-20"}`}
    >
      {name}
    </li>
  );
}

function Sidebar() {
  const [isSublistOpen, setIsSublistOpen] = useState(false);

  return (
    <div className="flex flex-col bg-userSidebarBg p-3 text-lg">
      <ul>
        <li className="">
          <button
            type="button"
            onClick={() => setIsSublistOpen((state) => !state)}
            className="flex items-center gap-x-1 p-2"
          >
            {isSublistOpen ? (
              <FolderIcon className="size-4 text-userSequenceButtonYellow/90" />
            ) : (
              <FolderOpenIcon className="size-4 text-userSequenceButtonYellow/90" />
            )}
            Claps
          </button>
        </li>
        {isSublistOpen && (
          <ul className="-mt-2 ml-4 text-base">
            {allClapSounds.map(({ name, url }) => (
              <div key={name} className="flex items-center gap-x-2">
                <MusicalNoteIcon className="size-3" />
                <DraggableListItem key={name} name={name} url={url} />
              </div>
            ))}
          </ul>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
