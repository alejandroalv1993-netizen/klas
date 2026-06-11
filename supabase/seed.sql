insert into public.categories (name, slug) values
  ('Marketing', 'marketing'),
  ('Derecho', 'derecho'),
  ('Informática', 'informatica'),
  ('Historia', 'historia')
on conflict (slug) do nothing;

insert into public.universities (name, slug) values
  ('Universidad de Málaga', 'universidad-de-malaga'),
  ('Universidad de Vigo', 'universidad-de-vigo'),
  ('Universidad Politécnica de Madrid', 'universidad-politecnica-de-madrid')
on conflict (slug) do nothing;

insert into public.subjects (name, slug, university_id)
select 'Fundamentos de Marketing', 'fundamentos-de-marketing', u.id
from public.universities u
where u.slug = 'universidad-de-malaga'
on conflict (slug) do nothing;

-- Resource rows require a real authenticated author. Create the initial resource
-- through the application after registering the first account.
