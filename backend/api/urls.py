from django.urls import path
from .views import generate_description, generate_ai_action

urlpatterns = [
    path('generate-description/', generate_description),
    path('generate-ai-action/', generate_ai_action)

]