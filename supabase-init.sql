-- ============================================================
-- Skill Hub · Supabase 数据库初始化脚本
-- 运行方式：在 Supabase 控制台 → SQL Editor → 粘贴执行
-- ============================================================

-- ===== 1. 技能表 =====
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null default '1.0.0',
  summary text not null,
  description text not null default '',
  case_example text not null default '',
  author_id uuid not null,
  author_name text not null,
  author_avatar text,
  stars_count integer not null default 0,
  comments_count integer not null default 0,
  tags text[] not null default '{}',  -- 标签数组，存储英文 key
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_stars_count_idx on public.skills(stars_count desc);
create index if not exists skills_created_at_idx on public.skills(created_at desc);
create index if not exists skills_updated_at_idx on public.skills(updated_at desc);
create index if not exists skills_author_id_idx on public.skills(author_id);

-- ===== 2. 收藏表 =====
create table if not exists public.stars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  skill_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, skill_id)
);

create index if not exists stars_user_id_idx on public.stars(user_id);
create index if not exists stars_skill_id_idx on public.stars(skill_id);

-- ===== 3. 评论表 =====
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null,
  user_id uuid not null,
  user_name text not null,
  user_avatar text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_skill_id_idx on public.comments(skill_id);
create index if not exists comments_user_id_idx on public.comments(user_id);

-- ===== 4. 开启 RLS =====
alter table public.skills enable row level security;
alter table public.stars enable row level security;
alter table public.comments enable row level security;

-- ===== 5. RLS 策略 =====

-- skills: 所有人可读
create policy "所有人可读取 skills"
  on public.skills for select using (true);

-- skills: 登录用户可创建
create policy "登录用户可创建 skills"
  on public.skills for insert with check (auth.uid() is not null);

-- skills: 作者可更新
create policy "作者可更新 skills"
  on public.skills for update using (auth.uid() = author_id);

-- skills: 作者可删除
create policy "作者可删除 skills"
  on public.skills for delete using (auth.uid() = author_id);

-- stars: 所有人可读
create policy "读取所有 stars"
  on public.stars for select using (true);

-- stars: 用户创建自己的收藏
create policy "用户创建自己的 stars"
  on public.stars for insert with check (auth.uid() = user_id);

-- stars: 用户删除自己的收藏
create policy "用户删除自己的 stars"
  on public.stars for delete using (auth.uid() = user_id);

-- comments: 所有人可读
create policy "所有人可读取 comments"
  on public.comments for select using (true);

-- comments: 登录用户可评论
create policy "登录用户可评论"
  on public.comments for insert with check (auth.uid() is not null);

-- comments: 只能删自己的评论
create policy "用户删除自己的 comments"
  on public.comments for delete using (auth.uid() = user_id);

-- ===== 6. Done 表（用户标记已完成的技能）=====
create table if not exists public.user_done_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  skill_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, skill_id)
);

create index if not exists done_user_id_idx on public.user_done_skills(user_id);
create index if not exists done_skill_id_idx on public.user_done_skills(skill_id);

-- RLS
alter table public.user_done_skills enable row level security;

create policy "用户读取自己的 done"
  on public.user_done_skills for select using (auth.uid() = user_id);

create policy "用户创建自己的 done"
  on public.user_done_skills for insert with check (auth.uid() = user_id);

create policy "用户删除自己的 done"
  on public.user_done_skills for delete using (auth.uid() = user_id);

-- ===== 7. Star Toggle RPC 函数（原子操作）=====
create or replace function toggle_star(p_user_id uuid, p_skill_id uuid)
returns void as $$
begin
  if exists (select 1 from stars where user_id = p_user_id and skill_id = p_skill_id) then
    delete from stars where user_id = p_user_id and skill_id = p_skill_id;
    update skills set stars_count = greatest(0, stars_count - 1) where id = p_skill_id;
  else
    insert into stars (user_id, skill_id) values (p_user_id, p_skill_id);
    update skills set stars_count = stars_count + 1 where id = p_skill_id;
  end if;
end;
$$ language plpgsql security definer;
