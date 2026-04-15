-- ============================================================
-- Skill Hub v1.3.2 数据库迁移脚本
-- 添加 category 字段到 skills 表
-- ============================================================

-- 添加 category 字段（可选，默认为空）
alter table public.skills 
add column if not exists category text;

-- 添加注释说明
comment on column public.skills.category is '技能类别: knowledge(知识通识), experience(经验技巧), tool(产品工具)';

-- 更新现有数据，设置默认值（可选）
-- update public.skills set category = 'knowledge' where category is null;
