import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput,FlatList,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from 'react';

export default function App() {
  const[nomeProduto,setNomeProduto]=useState("")
  const[precoPreco,setPrecoProduto]=useState(0)
  const[listaProdutos,setListaProdutos]=useState([])

  //Chamando a função na inicialização do app
  useEffect(()=>{
    BuscarDados()
  },[])
  //Função para armazenar o produto no AsyncStorage
  async function SalvarProduto() {
    let produtos = [];//iniciando um array vazio

    //Verifica se já existe algum dado no AsynStorage
    if(await AsyncStorage.getItem("PRODUTOS")!=null){
      //se houver dados carregamos no array
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }

    //Adionando produto no array
    produtos.push({nomeP:nomeProduto,precoP:precoPreco})

    //Salvando os dados no AsyncStorage

    await AsyncStorage.setItem("PRODUTOS",JSON.stringify(produtos))
    
    alert("Produto Cadastrado")

    //Limpar o formulário
    setNomeProduto("")
    setPrecoProduto("")

    //Função para os buscar os dados
    BuscarDados()
  }

  async function BuscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProdutos(JSON.parse(p))
  }
  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>
      <TextInput 
        placeholder='Digite o nome do produto'
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value)=>setNomeProduto(value)}
      />

      {/* TextInput do Preço */}
      <TextInput 
        placeholder='Digite o preço do produto'
        style={styles.input}
        value={precoPreco}
        onChangeText={(value)=>setPrecoProduto(value)}
      />

      <TouchableOpacity style={styles.btn} onPress={SalvarProduto}>
        <Text>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={BuscarDados}>
        <Text>BUSCAR DADOS</Text>
      </TouchableOpacity>

      <FlatList 
        data={listaProdutos}
        renderItem={({item,index})=>{
          return(
            <View>
              <Text>Indice:{index}</Text>
              <Text>Nome do Produto:{item.nomeP}</Text>
              <Text>Preço do Produto:{item.precoP}</Text>
            </View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  
  },
  input:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15,
    marginVertical:3
  },
  btn:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15,
    backgroundColor:"lightblue",
    alignItems:"center",
    justifyContent:"center",
    marginVertical:3
  }
});
