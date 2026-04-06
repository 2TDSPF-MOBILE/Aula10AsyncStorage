import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput,FlatList,TouchableOpacity,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from 'react';
import { MaskedTextInput } from 'react-native-mask-text';

export default function App() {
  const[nomeProduto,setNomeProduto]=useState("")
  const[precoPreco,setPrecoProduto]=useState(0)
  const[listaProdutos,setListaProdutos]=useState([])
  const[produtoEditado,setProdutoEditado]=useState(null)

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

    //Verificar se o produto está sendo editado
    if(produtoEditado){
      //Atualizamos o produto existente
      produtos[produtoEditado.index]={nomeP:nomeProduto,precoP:precoPreco}
    }else{
      //Adionando produto no array
       produtos.push({nomeP:nomeProduto,precoP:precoPreco})
    }
   

    //Salvando os dados no AsyncStorage

    await AsyncStorage.setItem("PRODUTOS",JSON.stringify(produtos))
    
    alert(produtoEditado?"PRODUTO ATUALIZADO":"PRODUTO CADASTRADO")

    //Volta o estado produtoEditado para null
    setProdutoEditado(null)

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
  //Função para deletar um produto
  async function deletarProduto(index){
    Alert.alert("CONFIRMAR EXCLUSÃO","Deseja realmente excluir o produto?",[
      {
        text:"Cancelar",
        style:"cancel",
        onPress:()=>console.log("Botão cancelar clicado")
      },
      {
        text:"Confirmar",
        style:"destructive",
        onPress:async()=>{
          const tempDados = listaProdutos;
          const dados = tempDados.filter((item,ind)=>{
          return ind!==index
        })
        setListaProdutos(dados)//Atualiza o estado
        await AsyncStorage.setItem("PRODUTOS",JSON.stringify(dados))
        Alert.alert("Sucesso","Produto Excluído com sucesso.")
        }
      }
    ],{cancelable:true})
  }

  function editarProduto(index){
    const produto = listaProdutos[index]//Pega o produto
    setNomeProduto(produto.nomeP)
    setPrecoProduto(produto.precoP)
    setProdutoEditado({index})
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
      <MaskedTextInput 
        type="currency"
        placeholder='Digite o preço do produto'
        options={{
          prefix:"R$",
          decimalSeparator:",",
          groupSeparator:".",
          precision:2
        }}
        keyboardType='number-pad'
        style={styles.input}
        value={precoPreco}
        onChangeText={(text,rawText)=>setPrecoProduto(rawText)
        }
      />

      <TouchableOpacity style={styles.btn} onPress={SalvarProduto}>
        <Text>{produtoEditado?"ATUALIZAR":"CADASTRAR"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={BuscarDados}>
        <Text>BUSCAR DADOS</Text>
      </TouchableOpacity>

      <FlatList 
        data={listaProdutos}
        renderItem={({item,index})=>{
          return(
            <View style={styles.listaItem}>
              <Text>Nome do Produto:{item.nomeP}</Text>
              <Text>Preço do Produto:{item.precoP}</Text>
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity 
                  style={styles.btnEditar}
                  onPress={()=>editarProduto(index)}
                >
                  <Text>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnDeletar}
                  onPress={()=>deletarProduto(index)}
                >
                  <Text>Deletar</Text>
                </TouchableOpacity>
              </View>
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
  },
  listaItem:{
    width:300,
    borderWidth:1,
    borderRadius:15,
    height:80,
    alignItems:"center",
    justifyContent:"center",
    marginVertical:3
  },
  btnDeletar:{
    backgroundColor:"red",
    borderRadius:12,
    width:100,
    alignSelf:"flex-end",
    alignItems:"center",
    justifyContent:"center",
    height:25
  },
  btnEditar:{
    backgroundColor:"orange",
    borderRadius:12,
    width:100,
    alignSelf:"flex-end",
    alignItems:"center",
    justifyContent:"center",
    height:25
  }
});
