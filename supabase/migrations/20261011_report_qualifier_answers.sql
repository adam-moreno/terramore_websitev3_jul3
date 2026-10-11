-- Report pop-up answers in their own column (2026-10-11). course_type keeps its packed copy for older readers.
-- Keys: type, challenge (business questions), when, how (readiness). Additive; no data changes.
alter table website.free_courses_signups add column if not exists qualifier_answers jsonb;
