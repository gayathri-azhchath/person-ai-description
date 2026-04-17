from rest_framework import serializers
from .models import Person, AIHistory

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class AIHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIHistory
        fields = '__all__'