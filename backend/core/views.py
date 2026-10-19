from .extractor import extract_skills
from .analytics import top_missing_skills, progress_over_time
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Skill, UserSkill, JobDescription, ReadinessSnapshot
from .serializers import (
    RegisterSerializer, SkillSerializer, UserSkillSerializer,
    JobDescriptionSerializer,
)
from .services import MatchService

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all().order_by('name')
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]


class MySkillListCreateView(generics.ListCreateAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user).select_related('skill')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MySkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user)

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        job = get_object_or_404(JobDescription, pk=pk, user=request.user)
        result = MatchService(request.user, job).run()

        last = (
            ReadinessSnapshot.objects
            .filter(user=request.user, job=job)
            .order_by('-created_at')
            .first()
        )
        if last is None or last.match_score != result['match_score']:
            ReadinessSnapshot.objects.create(
                user=request.user, job=job, match_score=result['match_score']
            )
        return Response(result)

class TopMissingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(top_missing_skills(request.user))


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(progress_over_time(request.user))

class ExtractSkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        text = request.data.get('raw_text', '').strip()
        if not text:
            return Response({'detail': 'Paste a job description first.'}, status=400)

        items, method = extract_skills(text)

        results = []
        for item in items:
            skill = Skill.objects.filter(name__iexact=item['name']).first()
            if skill is None:
                skill = Skill.objects.create(name=item['name'])
            results.append({
                'skill': skill.id,
                'skill_name': skill.name,
                'importance': item['importance'],
            })
        return Response({'method': method, 'skills': results})