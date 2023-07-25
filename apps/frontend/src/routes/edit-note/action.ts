import { ActionFunction, redirect } from 'react-router-dom';
import { Note, NoteForm } from '../../types';
import { http } from '../../http';
import invariant from 'tiny-invariant';
import { toast } from 'react-hot-toast';
import { QueryClient } from '@tanstack/react-query';
import { noteQueryKeys } from '../../queries';

const updateNote = (
  noteId: number,
  { title, content }: NoteForm,
): Promise<Note> => {
  return http.patch(`/notes/${noteId}`, {
    title,
    content,
  });
};

export const editNoteAction =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request, params }) => {
    invariant(params.noteId);
    const noteId = Number(params.noteId);
    const formData = await request.formData();
    const noteForm = Object.fromEntries(formData) as NoteForm;

    try {
      const updatedNote = await updateNote(noteId, noteForm);
      await queryClient.invalidateQueries(noteQueryKeys.list(1));
      toast.success('Note Saved Successfully!');
      return redirect(`/notes/${updatedNote.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save note');
      return null;
    }
  };
