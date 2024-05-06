import random
from django.shortcuts import render, redirect
from django.contrib import messages

from .forms import TodoForm
from .models import Todo

from .fb import auth

def index(request):
	if request.method == "POST":
		form = TodoForm(request.POST)
		print(request.POST)
		try:
			decoded_token = auth.verify_id_token(form.data.get("token"))
			todo = Todo(uid=decoded_token['uid'])
			form = TodoForm(request.POST, instance=todo)
		except Exception as e: 
			print(e)
			return render(request,'index.html')
		finally:
			if form.is_valid():
				form.save()
		return redirect('todo')
		
	form = TodoForm()

	page = {
		"r": random.randint(100000,9999999),
		"forms": form
	}
	return render(request, 'index.html', page)
