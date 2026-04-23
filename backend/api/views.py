from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Person, AIHistory
from .serializers import PersonSerializer, AIHistorySerializer
import ollama
import os

OLLAMA_MODEL = 'tinyllama'


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class AIHistoryViewSet(viewsets.ModelViewSet):
    queryset = AIHistory.objects.all().order_by('-created_at')
    serializer_class = AIHistorySerializer


# Generate Bio using Ollama
@api_view(['POST'])
def generate_description(request):
    name = request.data.get('name')
    age = request.data.get('age')
    place = request.data.get('place')

    prompt = f"Write a short bio about {name}, who is {age} years old and lives in {place}."

    try:
        client = ollama.Client(host=os.getenv('OLLAMA_HOST'))
        response = client.chat(
            model=OLLAMA_MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        description = response['message']['content']
    except Exception as e:
        description = (
            f"Bio for {name} is not available right now. "
            f"The AI service is still starting up or the model is being downloaded. "
            f"Please try again in a few moments. (Error: {type(e).__name__})"
        )

    return Response({"description": description})


# Generate AI Action and Save to DB
@api_view(['POST'])
def generate_ai_action(request):
    name = request.data.get('name')

    prompt = f"Suggest a daily activity plan for a person named {name}."

    try:
        client = ollama.Client(host=os.getenv('OLLAMA_HOST'))
        response = client.chat(
            model=OLLAMA_MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        action_text = response['message']['content']
    except Exception as e:
        action_text = (
            f"Activity plan for {name} is not available right now. "
            f"The AI service is still starting up or the model is being downloaded. "
            f"Please try again in a few moments. (Error: {type(e).__name__})"
        )

    # Save to database
    AIHistory.objects.create(name=name, action=action_text)

    return Response({"action": action_text})