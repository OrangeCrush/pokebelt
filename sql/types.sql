/* 
   Pull type information from veekun
*/
select 
   cast(a.damage_factor as float) / 100 as damage_factor,
   (select t.identifier from types t where t.id = a.damage_type_id) as attacking_type,
   (select t.identifier from types t where t.id = a.target_type_id) as defending_type
from type_efficacy a

