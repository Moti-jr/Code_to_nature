from rest_framework.routers import DefaultRouter
from .views import CodingViewSet

router = DefaultRouter()
router.register(r'codingsessions', CodingViewSet)


urlpatterns = router.urls
