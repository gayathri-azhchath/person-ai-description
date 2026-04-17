from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import PersonViewSet, AIHistoryViewSet, generate_description, generate_ai_action
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'persons', PersonViewSet)
router.register(r'ai-history', AIHistoryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('generate-description/', generate_description),
    path('generate-ai-action/', generate_ai_action),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)