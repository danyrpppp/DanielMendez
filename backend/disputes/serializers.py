from rest_framework import serializers

from .models import Dispute, DisputeEvidence


class DisputeEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisputeEvidence
        fields = ["id", "uploaded_by", "file", "note", "created_at"]
        read_only_fields = ["id", "uploaded_by", "created_at"]


class DisputeSerializer(serializers.ModelSerializer):
    evidence = DisputeEvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = Dispute
        fields = [
            "id",
            "client",
            "technician",
            "service",
            "title",
            "description",
            "ai_summary",
            "priority",
            "status",
            "decision",
            "arbiter",
            "evidence",
            "created_at",
            "updated_at",
            "resolved_at",
        ]
        read_only_fields = ["id", "client", "ai_summary", "arbiter", "created_at", "updated_at", "resolved_at"]
