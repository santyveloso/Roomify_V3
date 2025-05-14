from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)
    user_type = serializers.ChoiceField(choices=[('leader', 'Leader'), ('roomie', 'Roomie')])
    phone = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['email'] = self.validated_data.get('email', '')
        data['user_type'] = self.validated_data.get('user_type', 'roomie')
        data['phone'] = self.validated_data.get('phone', '')
        data['profile_picture'] = self.validated_data.get('profile_picture', None)
        return data

