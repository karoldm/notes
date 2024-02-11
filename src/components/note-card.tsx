import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { INote } from '../interfaces/Note.interface';
import { useState } from 'react';
import { toast } from 'sonner';

interface NoteCardProps {
  note: INote;
  onNoteDeleted: (id: string) => void;
  onNoteUpdated: (id: string, content: string) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteUpdated }: NoteCardProps) {
  const [content, setContent] = useState(note.content);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  function handleUpdateNote() {
    onNoteUpdated(note.id, content);
    setIsTextareaFocused(false);
    toast.success('Nota editada com sucesso!');
  }

  function handleDiscardChanges() {
    setContent(note.content);
    setIsTextareaFocused(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left p-5 outline-none flex-1 flex flex-col">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.createdAt, { locale: ptBR, addSuffix: true })}
        </span>

        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.createdAt, { locale: ptBR, addSuffix: true })}
            </span>

            <textarea
              onFocus={() => setIsTextareaFocused(true)}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="text-sm resize-none rounded-md p-1 leading-6 text-slate-200 bg-transparent flex-1 outline-none focus:outline-lime-400"
            />
          </div>

          {isTextareaFocused ? (
            <div className="flex">
              <button
                type="button"
                onClick={handleUpdateNote}
                className="flex-1 bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="flex-1 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:bg-slate-900"
              >
                Descartar alterações
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNoteDeleted(note.id)}
              className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
            >
              Deseja <span className="text-red-400 group-hover:underline">apagar essa nota?</span>
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
