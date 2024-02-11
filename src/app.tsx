import { ChangeEvent, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { MenuIcon } from 'lucide-react'

import logo from './assets/Logo.svg';

import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

import { INote } from './interfaces/Note.interface';

function getNotes():INote[] {
  const notesOnStorage = localStorage.getItem('notes');

  if(notesOnStorage) {
    return JSON.parse(notesOnStorage);
  }
  
  return []
}

const initialNotes = getNotes();

function App() {

  const [notes, setNotes] = useState<INote[]>(initialNotes);
  const [search, setSearch] = useState('');

  function onNoteCreated(content: string) {
    const newNote: INote = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteUpdated(id: string, content: string) {
    const index = notes.findIndex(note => note.id === id);
    let newNotes = [...notes];

    if(index !== -1){
      newNotes[index].content = content;
    }

    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }
  
  function onNoteDeleted(id: string) {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value;

    setSearch(query);

    const filteredNotes = query !== '' ?
      initialNotes.filter(note => note.content.toLowerCase().includes(query.toLocaleLowerCase())) :
      initialNotes

    setNotes(filteredNotes);
  }

  function handleDragEnd(result: any) {
    if (!result.destination) return;

    const newNotes = Array.from(notes);
    const [reorderedNotes] = newNotes.splice(result.source.index, 1);
    newNotes.splice(result.destination.index, 0, reorderedNotes);

    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  return (
      <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
        <img src={logo} alt='nlw expert logo'/>
        <form className='w-full'>
          <input 
            onChange={handleSearch}
            type='text' 
            placeholder='Busque em suas notas...' 
            className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          />
        </form>
        <div className='h-px bg-slate-700' />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(provided) => (
                <ul className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 auto-rows-[250px] gap-6' ref={provided.innerRef} {...provided.droppableProps}>
                  <NewNoteCard onNoteCreated={onNoteCreated} />
                  {notes.map((note, index) => (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          className={`rounded-md ${snapshot.isDragging ? 'bg-slate-950' : 'bg-slate-800'} flex flex-col gap-y-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400`}
                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        >
                          <MenuIcon className='ml-5 mt-5 text-slate-400' size={18} />
                          <NoteCard note={note} onNoteDeleted={onNoteDeleted} onNoteUpdated={onNoteUpdated}/>
                        </li>
                      )}
                    </Draggable>
                  ))}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          
      </div>
  )
}

export default App
