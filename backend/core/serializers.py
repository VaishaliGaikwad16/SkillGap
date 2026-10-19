from .models import Skill, UserSkill, JobDescription, JobSkill
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Skill, UserSkill


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'category')


class UserSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = UserSkill
        fields = ('id', 'skill', 'skill_name', 'level')

    def validate(self, data):
        user = self.context['request'].user
        skill = data.get('skill')
        existing = UserSkill.objects.filter(user=user, skill=skill)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        if skill and existing.exists():
            raise serializers.ValidationError('You already added this skill.')
        return data

class JobSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = JobSkill
        fields = ('id', 'skill', 'skill_name', 'importance')


class JobDescriptionSerializer(serializers.ModelSerializer):
    skills = JobSkillSerializer(many=True)

    class Meta:
        model = JobDescription
        fields = ('id', 'title', 'company', 'raw_text', 'created_at', 'skills')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        job = JobDescription.objects.create(**validated_data)
        for item in skills_data:
            JobSkill.objects.update_or_create(
                job=job,
                skill=item['skill'],
                defaults={'importance': item.get('importance', 'required')},
            )
        return job