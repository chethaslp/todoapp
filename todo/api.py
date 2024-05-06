from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from todo.forms import TodoForm


from .fb import auth
from .models import Todo
from .serializers import TodoSerializer


class TodoListApi(APIView):

    # List all Todos of a User
    def get(self, request, *args, **kwargs):
        '''
        List all the todos for requested user
        '''
        try:
            '''
            Authentication:-

            API uses Firebase authentication to ensure the users are logged in and are trusted.
            ID Token is a JWT with uid and other user infos, signed with firebase servers.
            Authenticity of the tokens can be checked with sending the token to firebase in the backend.
            '''
            uid = auth.verify_id_token(request.headers.get('X-Token'),clock_skew_seconds=2)['uid']
            todos = Todo.objects.filter(uid=uid)
            serializer = TodoSerializer(todos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e) 
            return Response({"res": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)

    # Create Todo
    def post(self, request, *args, **kwargs):
        '''
        Create the Todo with given todo data
        '''
        try:
            uid = auth.verify_id_token(request.headers.get('X-Token'))['uid']
            todo = Todo(uid=uid)
            form = TodoForm(request.POST, instance=todo)
            if form.is_valid():
                form.save()
                return Response(form.data, status=status.HTTP_201_CREATED)
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
        except: 
            return Response({"res": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)


class TodoApi(APIView):

    def getTodo(self, tid, uid):
        '''
        Helper function to get the todo with given tid and uid.
        
        '''
        try:
            return Todo.objects.get(tid = tid, uid = uid)
        except Todo.DoesNotExist:
            return None

    # Get Todo
    def get(self, request, tid, *args, **kwargs):
        '''
        Retrieves the Todo with given todo_id
        '''
        try:
            uid = auth.verify_id_token(request.headers.get('X-Token'))['uid']

            todo = self.getTodo(tid,uid)
            if not todo: 
                return Response({"msg": "Todo does not exists"}, status=status.HTTP_404_NOT_FOUND )

            serializer = TodoSerializer(todo)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except: return Response({"res": "Unauthorized."}, status=status.HTTP_401_UNAUTHORIZED)       

    # Update Todo
    def put(self, request, tid, *args, **kwargs):
        '''
        Updates the todo item with given todo_id if exists
        '''

        try:
            uid = auth.verify_id_token(request.headers.get('X-Token'))['uid']

            todo = self.getTodo(tid, uid)
            if not todo: 
                return Response({"msg": "Todo does not exists"}, status=status.HTTP_404_NOT_FOUND )

            data = {
            'title': request.data.get('title'), 
            'details' : request.data.get('details'),
            'status': request.data.get('status'),
            'end_date' : request.data.get('end_date'),
            }
            serializer = TodoSerializer(instance = todo, data=data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except: 
            return Response({"res": "Unauthorized."}, atus=status.HTTP_401_UNAUTHORIZED)  

    # Delete Todo
    def delete(self, request, tid, *args, **kwargs):
        '''
        Deletes the todo item with given todo_id if exists
        '''
        try:
            uid = auth.verify_id_token(request.headers.get('X-Token'))['uid']

            todo = self.getTodo(tid, uid)
            if not todo: 
                return Response({"msg": "Todo does not exists"}, status=status.HTTP_404_NOT_FOUND )

            todo.delete()
            return Response({"msg": "Todo deleted!"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e) 
            return Response({"res": "Unauthorized."}, atus=status.HTTP_401_UNAUTHORIZED)