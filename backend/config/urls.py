from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import MeAPIView, RegisterAPIView
from catalog.views import CategoryViewSet, ServiceViewSet, TechnicianProfileViewSet, ZoneViewSet
from disputes.views import DisputeViewSet
from notifications.views import NotificationViewSet
from recommendations.views import RecommendationAPIView
from reputation.views import PenaltyViewSet, RatingViewSet
from whatsapp.views import WhatsAppWebhookView

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("zones", ZoneViewSet)
router.register("technicians", TechnicianProfileViewSet)
router.register("services", ServiceViewSet)
router.register("ratings", RatingViewSet)
router.register("penalties", PenaltyViewSet)
router.register("disputes", DisputeViewSet)
router.register("notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterAPIView.as_view(), name="register"),
    path("api/auth/me/", MeAPIView.as_view(), name="me"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/recommendations/", RecommendationAPIView.as_view(), name="recommendations"),
    path("api/whatsapp/webhook/", WhatsAppWebhookView.as_view(), name="whatsapp_webhook"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
