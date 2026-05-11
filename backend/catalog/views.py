from rest_framework import permissions, viewsets

from .models import Category, Service, TechnicianProfile, Zone
from .serializers import CategorySerializer, ServiceSerializer, TechnicianProfileSerializer, ZoneSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TechnicianProfileViewSet(viewsets.ModelViewSet):
    queryset = TechnicianProfile.objects.select_related("user").prefetch_related("zones")
    serializer_class = TechnicianProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.select_related("technician__user", "category").prefetch_related("technician__zones", "photos")
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
