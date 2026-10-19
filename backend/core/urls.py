from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView, SkillListCreateView,
    MySkillListCreateView, MySkillDetailView,
    JobListCreateView, JobMatchView,
    TopMissingView, ProgressView,
    ExtractSkillsView,
)

urlpatterns = [
    path('jobs/extract-skills/', ExtractSkillsView.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('skills/', SkillListCreateView.as_view()),
    path('my-skills/', MySkillListCreateView.as_view()),
    path('my-skills/<int:pk>/', MySkillDetailView.as_view()),
    path('jobs/', JobListCreateView.as_view()),
    path('jobs/<int:pk>/match/', JobMatchView.as_view()),
    path('analytics/top-missing/', TopMissingView.as_view()),
    path('analytics/progress/', ProgressView.as_view()),
]