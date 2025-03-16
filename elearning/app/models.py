from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

#--------------- dodělat user, buď použít knihovnu abstractuser a nebo udělat vlastní model usera
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    

class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    capacity = models.IntegerField()
    teacher = models.ManyToManyField(User, related_name='courses')
    students = models.ManyToManyField(User, related_name='enrolled_courses', blank=True)
    is_premium = models.BooleanField(default=False)
    has_ads = models.BooleanField(default=True)


class Material(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='materials/')


class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateTimeField()
    min_score = models.IntegerField()
    max_attempts = models.IntegerField(default=1)


class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    file = models.FileField(upload_to='submissions/')
    score = models.IntegerField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)



class ChatMessage(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class TestResult(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='test_results')
    score = models.IntegerField()
    date_taken = models.DateTimeField(auto_now_add=True)


class ContactForm(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class VoiceChannel(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='voice_channels')
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class FinalTest(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='final_tests')
    title = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateTimeField()
    min_score = models.IntegerField()
    max_attempts = models.IntegerField(default=1)
    is_unlocked = models.BooleanField(default=False)  # Unlocked after completing all assignments