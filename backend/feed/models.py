from django.db import models
from django.contrib.auth.models import User
from houses.models import House


class Post(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    is_aviso = models.BooleanField(default=False)  # True para avisos ? 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #image = models.ImageField(upload_to='post_images/', blank=True, null=True)

    def __str__(self):
        return f"Post by {self.author.username} in {self.house.name}"


# comentarios a posts
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.username} on Post {self.post.id}"