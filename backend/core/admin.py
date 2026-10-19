from django.contrib import admin
from .models import Skill, UserSkill, JobDescription, JobSkill, ReadinessSnapshot

for m in (Skill, UserSkill, JobDescription, JobSkill, ReadinessSnapshot):
    admin.site.register(m)