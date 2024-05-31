import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
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
      className={`peer w-full cursor-pointer py-1 text-sm transition-all hover:pl-0.5 hover:brightness-200 ${dragging && "opacity-20"}`}
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
        className={`flex w-full items-center justify-between gap-x-1 p-1 px-4 py-2 hover:bg-userGray9 ${isSublistOpen && "bg-userGray9"}`}
      >
        {name}
        {isSublistOpen && <ChevronDownIcon className="size-6" />}
      </button>
      {isSublistOpen && (
        <ul className="-mt-1 py-2 text-base font-medium">
          {sounds.map(({ name: soundName, url }) => (
            <div
              key={soundName}
              className="relative ml-4 flex items-center gap-x-2 border-l border-l-neutral-400 pl-5"
            >
              <DraggableListItem key={soundName} name={soundName} url={url} />
              <ChevronRightIcon className="pointer-events-none absolute right-2 top-1/2 hidden size-5 -translate-y-1/2 cursor-pointer peer-hover:flex" />
            </div>
          ))}
        </ul>
      )}
    </li>
  );
}

function Sidebar() {
  return (
    <div className="no-scrollbar flex select-none flex-col overflow-y-scroll bg-userGray8 p-2 pt-5 font-semibold text-slate-200">
      <ul>
        {allSounds.map(([name, sounds]) => (
          <ListItem
            key={name as string}
            name={name as string}
            sounds={sounds as ISound[]}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
