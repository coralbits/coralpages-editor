/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useCallback, useEffect, useRef, useState } from "react";

let dialog_id = 0;

const next_dialog_id = () => {
  return `dialog-${dialog_id++}`;
};

export interface DialogProps<T = any> {
  id?: string;
  title: string;
  content: (props: DialogState) => React.ReactNode;
  state?: T;
  buttons?: {
    label: string;
    onClick: (props: DialogState) => void;
  }[];
}

export interface DialogState<T = any> {
  id: string;
  close: () => void;
  reject: (state?: T) => void;
  accept: (state?: T) => void;
  state: T;
  setState: (state: Partial<T>) => void;
  content: (props: DialogState) => React.ReactNode;
  title: string;
  buttons?: {
    label: string;
    onClick: (props: DialogState) => void;
  }[];
}

let setDialogStack = (
  setter: (old_dialogs: DialogState[]) => DialogState[]
) => {};

export const set_setDialogStack = (
  new_setDialogStack: (
    setter: (old_dialogs: DialogState[]) => DialogState[]
  ) => void
) => {
  setDialogStack = new_setDialogStack;
};

const remove_from_stack = (id: string) => {
  setDialogStack((oldprops) => {
    return oldprops.filter((props) => props.id !== id);
  });
};

const add_to_stack = (props: DialogState) => {
  setDialogStack((oldprops) => {
    return [...oldprops, props];
  });
};

export const dialog = async <T = any,>(props: DialogProps<T>) => {
  return new Promise<T>((resolve, reject) => {
    const id = props.id || next_dialog_id();
    const state: DialogState = {
      id,
      close: () => {
        // This will be overridden by the Dialog component to handle transitions
        remove_from_stack(id);
      },
      reject: (reject_state?: T) => {
        // This will be overridden by the Dialog component to handle transitions
        remove_from_stack(id);
        reject((reject_state as T) || state.state);
      },
      accept: (accept_state?: T) => {
        // This will be overridden by the Dialog component to handle transitions
        remove_from_stack(id);
        resolve((accept_state as T) || state.state);
      },
      state: props.state,
      setState: (new_state: Partial<T>) => {}, // will be set by Dialog component
      content: props.content,
      title: props.title,
      buttons: props.buttons,
      // Store original promise functions for transition handling
    };
    add_to_stack(state);
  });
};

export const DialogStack = () => {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);

  useEffect(() => {
    set_setDialogStack(setDialogs);
  }, [dialogs]);

  return (
    <>
      {dialogs.map((dialog) => (
        <Dialog key={dialog.id} dialog={dialog} />
      ))}
    </>
  );
};

const Dialog = ({ dialog }: { dialog: DialogState }) => {
  const [state, setState] = useState(dialog.state);
  const [isVisible, setIsVisible] = useState(false);
  const dialog_ref = useRef<HTMLDialogElement>(null);

  // Override close functions to handle transitions
  const closeWithTransition = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      remove_from_stack(dialog.id);
    }, 300); // Match transition duration
  }, [dialog.id]);

  const rejectWithTransition = useCallback(
    (reject_state?: any) => {
      setIsVisible(false);
      setTimeout(() => {
        // Access the original promise reject function
        const dialogWithPromise = dialog as any;
        dialogWithPromise.reject(reject_state);
        remove_from_stack(dialog.id);
      }, 300);
    },
    [dialog.id, dialog]
  );

  const acceptWithTransition = useCallback(
    (accept_state?: any) => {
      setIsVisible(false);
      setTimeout(() => {
        // Access the original promise resolve function
        const dialogWithPromise = dialog as any;
        dialogWithPromise.accept(accept_state);
        remove_from_stack(dialog.id);
      }, 300);
    },
    [dialog.id, dialog]
  );

  // close when clicking outside
  useEffect(() => {
    const dialog_el = dialog_ref.current;
    if (!dialog_el) return;

    dialog_el.showModal();

    // Trigger visibility transition after modal is shown
    setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const close_dialog = (e: MouseEvent) => {
      if (e.target === dialog_el) {
        closeWithTransition();
        // dialog_el.close();
      }
    };

    dialog_el.addEventListener("click", close_dialog);
    return () => {
      dialog_el.removeEventListener("click", close_dialog);
    };
  }, [dialog_ref, closeWithTransition]);

  dialog.state = state; // dirty, but works

  const dstate = {
    ...dialog,
    state,
    setState,
    close: closeWithTransition,
    reject: rejectWithTransition,
    accept: acceptWithTransition,
  };
  return (
    <>
      <style>
        {`
          dialog[data-dialog-id="${dialog.id}"]::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 300ms ease-in-out;
            opacity: ${isVisible ? 1 : 0};
          }
        `}
      </style>
      <dialog
        key={dialog.id}
        data-dialog-id={dialog.id}
        className={`grid place-items-center m-auto rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 z-50 transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        id={dialog.id}
        ref={dialog_ref}
      >
        <div>
          <h2 className="text-2xl font-bold p-5 bg-blue-600 dark:bg-blue-500 text-white">
            {dialog.title}
          </h2>
          <div className="p-4">{dialog.content(dstate)}</div>
          <div className="flex justify-end gap-2 p-4">
            {dialog.buttons?.map((button) => (
              <button
                className="btn cursor-pointer"
                key={button.label}
                onClick={() => {
                  button.onClick(dstate);
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};
