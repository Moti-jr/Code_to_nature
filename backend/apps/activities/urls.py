from .views import ActivitiesViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ActivitiesViewSet, basename='activities')
urlpatterns = router.urls
