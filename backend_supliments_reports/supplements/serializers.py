from rest_framework import serializers
from .models import (
    SupplementCategory,
    SupplementProduct,
    UserSupplementStack,
    SupplementReminder,
    SupplementDailyLog,
    SupplementGoal,
    SupplementWishlist,
    SupplementCartItem,
    SupplementArticle,
)

class SupplementCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplementCategory
        fields = ('id', 'slug', 'name', 'description', 'icon', 'icon_url', 'display_order')


class SupplementProductSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    badge = serializers.SerializerMethodField()
    reviewsCount = serializers.CharField(source='reviews_count', read_only=True)
    originalPrice = serializers.DecimalField(source='original_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = SupplementProduct
        fields = (
            'id', 'name', 'slug', 'category', 'category_slug', 'brand',
            'image', 'image_url', 'badge', 'badge_text', 'badge_color',
            'rating', 'reviews_count', 'reviewsCount', 'price',
            'original_price', 'originalPrice', 'discount_percent',
            'description', 'benefits', 'in_stock', 'is_featured'
        )

    def get_badge(self, obj):
        if obj.badge_text:
            return {
                'text': obj.badge_text,
                'color': obj.badge_color or 'bg-[#2BAF34] text-black font-semibold'
            }
        return None


class UserSupplementStackSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(source='start_date', required=False)
    image = serializers.CharField(source='image_url', required=False, allow_blank=True)

    class Meta:
        model = UserSupplementStack
        fields = (
            'id', 'name', 'category', 'product', 'dosage', 'timing',
            'start_date', 'startDate', 'end_date', 'status',
            'image', 'image_url', 'notes', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)


class SupplementReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplementReminder
        fields = ('id', 'name', 'dose', 'time', 'is_enabled', 'icon_url', 'stack_item', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SupplementDailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplementDailyLog
        fields = ('id', 'stack_item', 'date', 'is_taken', 'taken_at')
        read_only_fields = ('id', 'taken_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SupplementGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplementGoal
        fields = ('id', 'title', 'percentage', 'color')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SupplementArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplementArticle
        fields = ('id', 'title', 'subtitle', 'content', 'image_url', 'published_date')


class SupplementWishlistSerializer(serializers.ModelSerializer):
    product_details = SupplementProductSerializer(source='product', read_only=True)

    class Meta:
        model = SupplementWishlist
        fields = ('id', 'product', 'product_details', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SupplementCartItemSerializer(serializers.ModelSerializer):
    product_details = SupplementProductSerializer(source='product', read_only=True)

    class Meta:
        model = SupplementCartItem
        fields = ('id', 'product', 'product_details', 'quantity', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

