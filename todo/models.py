from django.db import models
from django.utils import timezone

STATUS = (
    ('completed','Completed'),
    ('pending', 'Pending'),
    ('dropped','Dropped')
)

class Todo(models.Model):
	uid = models.CharField(max_length=30)
	tid = models.AutoField(primary_key=True)
	title = models.CharField(max_length=100)
	details = models.TextField()
	status=models.CharField(max_length=10, choices=STATUS, default='pending')
	post_date = models.DateTimeField(default=timezone.now)
	end_date = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return self.title