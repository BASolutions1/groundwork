-- Checklist progress and the note written when a step is finished.
-- checklist_done stores indexes into playbook_steps.what_youll_do.
-- A step is marked done when every checklist line is checked.

alter table public.user_steps
  add column checklist_done smallint[] not null default '{}',
  add column completion_note text;

alter table public.user_steps
  add constraint user_steps_checklist_done_range
  check (
    cardinality(checklist_done) <= 24
    and 0 <= all (checklist_done)
  );

alter table public.user_steps
  add constraint user_steps_completion_note_length
  check (completion_note is null or char_length(completion_note) <= 4000);
