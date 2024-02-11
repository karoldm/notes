import { ChangeEvent, useState } from 'react';
import logo from './assets/Logo.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import { INote } from './interfaces/Note.interface';

function App() {
  const [notes, setNotes] = useState<INote[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if(notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    
    return []
  });
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
  
  function onNoteDeleted(id: string) {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }


  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value;

    setSearch(query);

    const filteredNotes = query !== '' ?
      notes.filter(note => note.content.toLowerCase().includes(query.toLocaleLowerCase())) :
      notes

    setNotes(filteredNotes);
  }

  return (
   <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>
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

    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 auto-rows-[250px] gap-6'>
      <NewNoteCard onNoteCreated={onNoteCreated} />
      { 
        notes.map(note => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))
      }
    </div>
   </div>
  )
}

export default App
