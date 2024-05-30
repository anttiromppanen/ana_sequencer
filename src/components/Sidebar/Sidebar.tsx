import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  FolderIcon,
  MusicalNoteIcon,
  FolderOpenIcon,
} from "@heroicons/react/16/solid";
import allSounds from "../../helpers/sounds/importAllSounds";
import { ISound } from "../../types/types";

function DraggableListItem({ name, url }: { name: string; url: string }) {
  const listItemRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = listItemRef.current;

    if (!el) return undefined;

    return draggable({
      element: el,
      getInitialData: () => ({ name, url }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
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

function ListItem({ name, sounds }: { name: string; sounds: ISound[] }) {
  const [isSublistOpen, setIsSublistOpen] = useState(false);

  return (
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
        {name}
      </button>
      {isSublistOpen && (
        <ul className="-mt-2 ml-4 text-base">
          {sounds.map(({ name: soundName, url }) => (
            <div key={soundName} className="flex items-center gap-x-2">
              <MusicalNoteIcon className="size-3" />
              <DraggableListItem key={soundName} name={soundName} url={url} />
            </div>
          ))}
        </ul>
      )}
    </li>
  );
}

function Sidebar() {
  return (
    <div className="bg-userGray8 flex flex-col p-3 text-lg">
      <ul>
        {allSounds.map(([name, sounds]) => (
          <ListItem name={name as string} sounds={sounds as ISound[]} />
        ))}
        {/*
         */}
      </ul>
    </div>
  );
}

export default Sidebar;
